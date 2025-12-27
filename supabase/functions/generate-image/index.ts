import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CREDITS_PER_IMAGE = 2;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("No authorization header");
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    const cloudinaryCloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const cloudinaryApiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const cloudinaryApiSecret = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      console.error("Cloudinary credentials not configured");
      return new Response(
        JSON.stringify({ error: "Cloudinary not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client for user auth
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Admin client for updating credits
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.log("User authentication failed:", userError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request
    const { prompt, size = "1024x1024" } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Generating image for user:", user.id, "Prompt:", prompt.substring(0, 50));

    // Check user credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch credits" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentCredits = profile?.credits ?? 0;

    if (currentCredits < CREDITS_PER_IMAGE) {
      console.log("Insufficient credits. Current:", currentCredits);
      return new Response(
        JSON.stringify({ 
          error: "Insufficient credits", 
          credits: currentCredits,
          required: CREDITS_PER_IMAGE 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call OpenAI Image Generation API
    console.log("Calling OpenAI API...");
    const openAIResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        n: 1,
        size: size,
        quality: "high",
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error("OpenAI API error:", openAIResponse.status, errorData);
      
      // Parse and provide user-friendly error messages
      let userMessage = "Failed to generate image";
      try {
        const errorJson = JSON.parse(errorData);
        if (errorJson.error?.code === "billing_hard_limit_reached") {
          userMessage = "OpenAI API billing limit reached. Please contact support or try again later.";
        } else if (errorJson.error?.code === "rate_limit_exceeded") {
          userMessage = "Too many requests. Please wait a moment and try again.";
        } else if (errorJson.error?.message) {
          userMessage = errorJson.error.message;
        }
      } catch {
        // Keep default message if parsing fails
      }
      
      return new Response(
        JSON.stringify({ error: userMessage }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openAIData = await openAIResponse.json();
    console.log("OpenAI response received");

    // Get the base64 image data from OpenAI
    const imageData = openAIData.data[0];
    const base64Image = imageData.b64_json;

    if (!base64Image) {
      console.error("No base64 image data from OpenAI");
      return new Response(
        JSON.stringify({ error: "No image data received from OpenAI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "generated-images";
    const publicId = `${user.id}/${Date.now()}`;
    
    // Create signature for Cloudinary upload
    const signatureString = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${cloudinaryApiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const formData = new FormData();
    formData.append("file", `data:image/png;base64,${base64Image}`);
    formData.append("api_key", cloudinaryApiKey);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("public_id", publicId);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const cloudinaryError = await cloudinaryResponse.text();
      console.error("Cloudinary upload error:", cloudinaryError);
      return new Response(
        JSON.stringify({ error: "Failed to upload image to storage", details: cloudinaryError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const cloudinaryData = await cloudinaryResponse.json();
    const imageUrl = cloudinaryData.secure_url;
    console.log("Image uploaded to Cloudinary:", imageUrl);

    // Deduct credits using admin client
    const newCredits = currentCredits - CREDITS_PER_IMAGE;
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ credits: newCredits })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error deducting credits:", updateError);
      // Still return image even if credit deduction fails
    } else {
      console.log("Credits deducted. New balance:", newCredits);
    }

    // Store image info using user's auth context
    const { data: savedImage, error: saveError } = await supabase
      .from("generated_images")
      .insert({
        user_id: user.id,
        prompt: prompt,
        image_url: imageUrl,
        credits_used: CREDITS_PER_IMAGE,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving image:", saveError);
      // Still return image even if save fails
    } else {
      console.log("Image saved with id:", savedImage.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        image_url: imageUrl,
        image_id: savedImage?.id,
        credits_remaining: newCredits,
        credits_used: CREDITS_PER_IMAGE,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error generating image:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

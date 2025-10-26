import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const accessToken = import.meta.env.META_ACCESS_TOKEN;
    const pageId = import.meta.env.META_PAGE_ID;

    if (!accessToken || !pageId) {
      return new Response(
        JSON.stringify({ error: 'Meta credentials not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener posts de Facebook directamente
    const fbPostsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,full_picture,created_time,permalink_url&limit=12&access_token=${accessToken}`
    );
    
    const fbPostsData = await fbPostsResponse.json();

    if (fbPostsData.error) {
      console.error('Facebook API Error:', fbPostsData.error);
      return new Response(
        JSON.stringify({ error: fbPostsData.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({
        source: 'facebook',
        posts: fbPostsData.data || []
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching social media posts:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

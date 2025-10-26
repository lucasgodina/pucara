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

    // Obtener el Instagram Business Account ID asociado a la página
    const igAccountResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );
    
    const igAccountData = await igAccountResponse.json();
    const igAccountId = igAccountData.instagram_business_account?.id;

    if (!igAccountId) {
      // Si no hay cuenta de Instagram, obtener posts de Facebook
      const fbPostsResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,full_picture,created_time,permalink_url&limit=10&access_token=${accessToken}`
      );
      
      const fbPostsData = await fbPostsResponse.json();
      
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
    }

    // Obtener posts de Instagram
    const igPostsResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`
    );

    const igPostsData = await igPostsResponse.json();

    if (igPostsData.error) {
      console.error('Instagram API Error:', igPostsData.error);
      return new Response(
        JSON.stringify({ error: igPostsData.error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        source: 'instagram',
        posts: igPostsData.data || []
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

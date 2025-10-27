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

    // Intentar obtener Instagram Business Account
    try {
      const igAccountResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
      );
      
      if (igAccountResponse.ok) {
        const igAccountData = await igAccountResponse.json();
        const igAccountId = igAccountData.instagram_business_account?.id;

        if (igAccountId) {
          // Obtener posts de Instagram
          const igPostsResponse = await fetch(
            `https://graph.facebook.com/v18.0/${igAccountId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`
          );

          if (igPostsResponse.ok) {
            const igPostsData = await igPostsResponse.json();
            
            if (igPostsData.data && igPostsData.data.length > 0) {
              return new Response(
                JSON.stringify({
                  source: 'instagram',
                  posts: igPostsData.data
                }),
                { 
                  status: 200, 
                  headers: { 'Content-Type': 'application/json' } 
                }
              );
            }
          }
        }
      }
    } catch (igError) {
      console.log('Instagram not available, falling back to Facebook:', igError);
    }

    // Fallback: Obtener posts de Facebook
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

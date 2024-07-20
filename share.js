const axios = require('axios');

const accessToken = 'EAAAAUaZA8jlABOzbK3TmXZBBacgb81GDLZB4T5pzkttZClsRE3MBj4nRPhxmCNSEjJWWcyUm89hag9QcjJC0f4iCYOEq52I7QEoKfr6aBdNZBStU27Kg7sluZBqoP2Q0eoUsvbXqQj2Iv4gHpWmgaGk0daUl9w7ZBu06cD2cqc9TRfNahav3aujDka2EPitQc2H5w3mEsuuxAZDZD';
const shareUrl = 'https://www.facebook.com/100086980630281/posts/pfbid0Ej6jGrztdqkYscjdCBroEDpmim7Y3977kbMtSXYmH2MuwreN3jJzBhieruAT5GqPl/?app=fbl';
const shareCount = 22200;
const timeInterval = 1500;
const deleteAfter = 60 * 60;

let sharedCount = 0;
let timer = null;

async function sharePost() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/me/feed?access_token=${accessToken}&fields=id&limit=1&published=0`,
      {
        link: shareUrl,
        privacy: { value: 'SELF' },
        no_story: true,
      },
      {
        muteHttpExceptions: true,
        headers: {
          authority: 'graph.facebook.com',
          'cache-control': 'max-age=0',
          'sec-ch-ua-mobile': '?0',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
          },
          method: 'post',
      }
    );

    sharedCount++;
    const postId = response?.data?.id;

    console.log(`Post shared: ${sharedCount}`);
    console.log(`Post ID: ${postId || 'Unknown'}`);

    if (sharedCount === shareCount) {
      clearInterval(timer);
      console.log('Finished sharing posts.');

      if (postId) {
        setTimeout(() => {
          deletePost(postId);
        }, deleteAfter * 1000);
      }
    }
  } catch (error) {
    console.error('Failed to share post:', error.response.data);
  }
}

async function deletePost(postId) {
  try {
    await axios.delete(`https://graph.facebook.com/${postId}?access_token=${accessToken}`);
    console.log(`Post deleted: ${postId}`);
  } catch (error) {
    console.error('Failed to delete post:', error.response.data);
  }
}

timer = setInterval(sharePost, timeInterval);

setTimeout(() => {
  clearInterval(timer);
  console.log('Loop stopped.');
}, shareCount * timeInterval);

import { tweetsData as tweets } from "/data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

let tweetsData = JSON.parse(JSON.stringify(tweets));

const tweetsFromLocalStorage = JSON.parse(localStorage.getItem("myTweets"));

if (tweetsFromLocalStorage) {
  tweetsData = tweetsFromLocalStorage;
}

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.reply) {
    handleReplyClick(e.target.dataset.reply);
  } else if (e.target.id === "tweet-btn") {
    handleTweetBtnClick();
  } else if (e.target.id === "addTweetComment") {
    addComment();
  }
});

function handleLikeClick(tweetId) {
  const targetTweetObject = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];
  if (!targetTweetObject.isLiked) {
    targetTweetObject.likes++;
  } else {
    targetTweetObject.likes--;
  }

  targetTweetObject.isLiked = !targetTweetObject.isLiked;

  render();
}

function handleRetweetClick(tweetId) {
  const targetTweetObject = tweetsData.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (!targetTweetObject.isRetweeted) {
    targetTweetObject.retweets++;
  } else {
    targetTweetObject.retweets--;
  }

  targetTweetObject.isRetweeted = !targetTweetObject.isRetweeted;

  render();
}

function handleReplyClick(replyId) {
  document.getElementById(`replies-${replyId}`).classList.toggle("hidden");
}

function handleTweetBtnClick() {
  const tweetInput = document.getElementById("tweet-input");

  if (tweetInput.value) {
    tweetsData.unshift({
      handle: `@Scrimba`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: `${tweetInput.value}`,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
  }
  render();
  tweetInput.value = "";
}

function addComment() {
  const commentInput = document.getElementById("comment-input").value;
  console.log(commentInput);
}

function getFeedHtml() {
  let feedHtml = ``;

  tweetsData.forEach(function (tweet) {
    let likeIconClass = "";
    let retweetIconClass = "";

    if (tweet.isLiked) {
      likeIconClass = "liked";
    }
    if (tweet.isRetweeted) {
      retweetIconClass = "retweeted";
    }

    let repliesHtml = "";

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
        <div class="tweet-reply">
        <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${reply.handle}</p>
                    <p class="tweet-text">${reply.tweetText}</p>
                </div>
            </div>
    </div>
`;
      });
      repliesHtml += `    
    <div class="tweet-reply">
    <div class="tweet-inner">
        <img src="./images/scrimbalogo.png" class="profile-pic">
            <div>
                <p class="handle">@Scrimba</p>
                <p class="tweet-text"><textarea placeholder="Add a comment..." id="comment-input"></textarea></p>
            </div>
        </div>
        <button id="addTweetComment">Add</button>
</div>`;
    } else {
      repliesHtml += `
      <div class="tweet-reply">
      <div class="tweet-inner">
          <img src="./images/scrimbalogo.png" class="profile-pic">
              <div>
                  <p class="handle">@Scrimba</p>
                  <p class="tweet-text"><textarea placeholder="Add a comment..." id="comment-input"></textarea></p>
              </div>
          </div>
          <button id="addTweetComment">Add</button>
  </div>`;
    }

    feedHtml += `
    <div class="tweet">
<div class="tweet-inner">
    <img src="${tweet.profilePic}" class="profile-pic">
    <div>
        <p class="handle">${tweet.handle}</p>
        <p class="tweet-text">${tweet.tweetText}</p>
        <div class="tweet-details">
            <span class="tweet-detail">
            <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                ${tweet.replies.length}
            </span>
            <span class="tweet-detail">
            <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
            ${tweet.likes}
            </span>
            <span class="tweet-detail">
            <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
            ${tweet.retweets}
            </span> 
        </div>   
    </div>             
</div>
<div class="hidden" id="replies-${tweet.uuid}">
${repliesHtml}
</div>  
</div>`;
  });

  return feedHtml;
}

function render() {
  localStorage.setItem("myTweets", JSON.stringify(tweetsData));
  document.getElementById("feed").innerHTML = getFeedHtml();
}

render();

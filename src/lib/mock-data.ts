
// Helper functions for localStorage
const getFromStorage = <T>(key: string, defaultData: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultData;
};

const saveToStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Mock users data with localStorage
export const users = getFromStorage('instagram-users', [
  {
    id: '1',
    username: 'johndoe',
    fullName: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Photographer | Traveler | Food Lover',
    followers: 1420,
    following: 356,
    posts: [1, 5, 9],
    verified: true,
  },
  {
    id: '2',
    username: 'janedoe',
    fullName: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Digital Artist | Creator',
    followers: 5680,
    following: 324,
    posts: [2, 6, 10],
    verified: true,
  },
  {
    id: '3',
    username: 'alexsmith',
    fullName: 'Alex Smith',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Tech Enthusiast | Coder',
    followers: 892,
    following: 267,
    posts: [3, 7],
    verified: false,
  },
  {
    id: '4',
    username: 'sarahparker',
    fullName: 'Sarah Parker',
    avatar: 'https://i.pravatar.cc/150?img=10',
    bio: 'Fashion | Beauty | Lifestyle',
    followers: 2340,
    following: 512,
    posts: [4, 8],
    verified: false,
  },
  {
    id: '5',
    username: 'mikejohnson',
    fullName: 'Mike Johnson',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Fitness Coach | Nutrition Expert',
    followers: 8760,
    following: 423,
    posts: [11, 12],
    verified: true,
  },
]);

// Mock stories data with localStorage
export const stories = getFromStorage('instagram-stories', [
  {
    id: '1',
    userId: '1',
    image: 'https://source.unsplash.com/random/1080x1920?sig=1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '2',
    image: 'https://source.unsplash.com/random/1080x1920?sig=2',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: '3',
    image: 'https://source.unsplash.com/random/1080x1920?sig=3',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    userId: '4',
    image: 'https://source.unsplash.com/random/1080x1920?sig=4',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    userId: '5',
    image: 'https://source.unsplash.com/random/1080x1920?sig=5',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
]);

// Default posts data
const defaultPosts = [
  {
    id: 1,
    userId: '1',
    images: ['https://source.unsplash.com/random/1080x1080?sig=11'],
    caption: 'Beautiful sunset at the beach today! 🌅 #sunset #beach #nature',
    likes: 234,
    comments: 42,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    userId: '2',
    images: ['https://source.unsplash.com/random/1080x1080?sig=12'],
    caption: 'Just finished my latest digital artwork. What do you think? #art #digital #creativity',
    likes: 567,
    comments: 89,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    userId: '3',
    images: ['https://source.unsplash.com/random/1080x1080?sig=13'],
    caption: 'New gadget day! Can\'t wait to try it out. #tech #gadgets #unboxing',
    likes: 123,
    comments: 21,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    userId: '4',
    images: [
      'https://source.unsplash.com/random/1080x1080?sig=14',
      'https://source.unsplash.com/random/1080x1080?sig=15',
    ],
    caption: 'Today\'s outfit of the day! Which one do you prefer? 1 or 2? #fashion #ootd #style',
    likes: 789,
    comments: 134,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    userId: '1',
    images: ['https://source.unsplash.com/random/1080x1080?sig=16'],
    caption: 'Morning coffee and work session ☕ #coffee #work #productivity',
    likes: 345,
    comments: 28,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    userId: '2',
    images: ['https://source.unsplash.com/random/1080x1080?sig=17'],
    caption: 'Just published my new portfolio website! Link in bio. #webdesign #portfolio #design',
    likes: 456,
    comments: 67,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 7,
    userId: '3',
    images: ['https://source.unsplash.com/random/1080x1080?sig=18'],
    caption: 'Working on a new coding project. Stay tuned! #coding #programming #developer',
    likes: 234,
    comments: 29,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 8,
    userId: '4',
    images: ['https://source.unsplash.com/random/1080x1080?sig=19'],
    caption: 'New beauty products review coming soon! #beauty #skincare #review',
    likes: 678,
    comments: 92,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 9,
    userId: '1',
    images: ['https://source.unsplash.com/random/1080x1080?sig=20'],
    caption: 'Hiking adventure with friends last weekend 🏔️ #hiking #adventure #friends',
    likes: 432,
    comments: 56,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 10,
    userId: '2',
    images: ['https://source.unsplash.com/random/1080x1080?sig=21'],
    caption: 'My workspace setup for 2023. Any suggestions? #workspace #setup #productivity',
    likes: 789,
    comments: 123,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 11,
    userId: '5',
    images: ['https://source.unsplash.com/random/1080x1080?sig=22'],
    caption: 'Today\'s workout complete! 💪 #fitness #workout #health',
    likes: 876,
    comments: 98,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 12,
    userId: '5',
    images: ['https://source.unsplash.com/random/1080x1080?sig=23'],
    caption: 'Meal prep Sunday! Here\'s my high protein lunch for the week. #mealprep #nutrition #healthyeating',
    likes: 543,
    comments: 76,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Get posts from localStorage
export const posts = getFromStorage('instagram-posts', defaultPosts);

// Mock comments data with localStorage
export const comments = getFromStorage('instagram-comments', [
  {
    id: '1',
    postId: 1,
    userId: '2',
    content: 'Absolutely stunning view! Where is this?',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 5,
  },
  {
    id: '2',
    postId: 1,
    userId: '3',
    content: 'The colors are amazing! Great shot.',
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    likes: 3,
  },
  {
    id: '3',
    postId: 2,
    userId: '1',
    content: 'This is incredible! Love the details.',
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    likes: 8,
  },
  {
    id: '4',
    postId: 3,
    userId: '4',
    content: 'Cool! Let me know how it works!',
    createdAt: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString(),
    likes: 2,
  },
]);

// Sample video URLs that should work in all browsers
const defaultVideoUrls = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
];

// Mock reels data with localStorage
export const reels = getFromStorage('instagram-reels', [
  {
    id: '1',
    userId: '1',
    video: defaultVideoUrls[0],
    caption: 'Behind the scenes of today\'s photoshoot! #photography #behindthescenes',
    likes: 4523,
    comments: 126,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    userId: '3',
    video: defaultVideoUrls[1],
    caption: 'New dance routine! What do you think? #dance #choreography',
    likes: 8912,
    comments: 342,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    userId: '5',
    video: defaultVideoUrls[2],
    caption: 'Quick arm workout you can do at home! #fitness #homeworkout',
    likes: 6723,
    comments: 289,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    userId: '4',
    video: defaultVideoUrls[3],
    caption: 'Easy cookie recipe that\'s ready in 15 minutes! #baking #cookies',
    likes: 5426,
    comments: 198,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
]);

// Mock music tracks data with localStorage
export const musicTracks = getFromStorage('instagram-music', [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'Beachy Tunes',
    coverArt: 'https://source.unsplash.com/random/300x300?sig=24',
    duration: '2:45',
    trending: true,
    usageCount: 12543,
  },
  {
    id: '2',
    title: 'Urban Beat',
    artist: 'City Sounds',
    coverArt: 'https://source.unsplash.com/random/300x300?sig=25',
    duration: '3:12',
    trending: true,
    usageCount: 8765,
  },
  {
    id: '3',
    title: 'Chill Afternoon',
    artist: 'Lofi Masters',
    coverArt: 'https://source.unsplash.com/random/300x300?sig=26',
    duration: '2:56',
    trending: false,
    usageCount: 4532,
  },
  {
    id: '4',
    title: 'Workout Energy',
    artist: 'Fitness Beats',
    coverArt: 'https://source.unsplash.com/random/300x300?sig=27',
    duration: '3:34',
    trending: true,
    usageCount: 9876,
  },
  {
    id: '5',
    title: 'Midnight Dreams',
    artist: 'Sleep Easy',
    coverArt: 'https://source.unsplash.com/random/300x300?sig=28',
    duration: '4:12',
    trending: false,
    usageCount: 3421,
  },
]);

// Helper function to get user by ID
export const getUserById = (userId: string) => {
  return users.find(user => user.id === userId);
};

// Helper function to get posts by user ID
export const getPostsByUserId = (userId: string) => {
  return posts.filter(post => post.userId === userId);
};

// Helper function to get comments by post ID
export const getCommentsByPostId = (postId: number) => {
  return comments.filter(comment => comment.postId === postId);
};

// Functions to update storage

// Add a new post
export const addPost = (post: any) => {
  const updatedPosts = [post, ...posts];
  saveToStorage('instagram-posts', updatedPosts);
  return updatedPosts;
};

// Add a comment
export const addComment = (comment: any) => {
  const updatedComments = [...comments, comment];
  saveToStorage('instagram-comments', updatedComments);
  return updatedComments;
};

// Like a post
export const likePost = (postId: number, increment: boolean = true) => {
  const updatedPosts = posts.map(post => {
    if (post.id === postId) {
      return {
        ...post,
        likes: increment ? post.likes + 1 : post.likes - 1
      };
    }
    return post;
  });
  saveToStorage('instagram-posts', updatedPosts);
  return updatedPosts;
};

// Like a reel
export const likeReel = (reelId: string, increment: boolean = true) => {
  const updatedReels = reels.map(reel => {
    if (reel.id === reelId) {
      return {
        ...reel,
        likes: increment ? reel.likes + 1 : reel.likes - 1
      };
    }
    return reel;
  });
  saveToStorage('instagram-reels', updatedReels);
  return updatedReels;
};

// Follow a user
export const followUser = (userId: string, increment: boolean = true) => {
  const updatedUsers = users.map(user => {
    if (user.id === userId) {
      return {
        ...user,
        followers: increment ? user.followers + 1 : user.followers - 1
      };
    }
    return user;
  });
  saveToStorage('instagram-users', updatedUsers);
  return updatedUsers;
};

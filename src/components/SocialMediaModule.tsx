import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, ThumbsUp, Share2, Eye, TrendingUp, AtSign, Hash } from 'lucide-react';

interface SocialMediaModuleProps {
  dangerMode: boolean;
}

const MOCK_PROFILES = [
  {
    id: 1,
    name: 'JOHN KAMAU',
    handle: '@jkamau_254',
    avatar: 'JK',
    followers: 2345,
    posts: 156,
    engagement: 78,
    status: 'ACTIVE',
    lastActive: '2 min ago',
    recentActivity: 'Posted about exam preparation',
  },
  {
    id: 2,
    name: 'MARY WANJIKU',
    handle: '@mary_edu',
    avatar: 'MW',
    followers: 5678,
    posts: 289,
    engagement: 92,
    status: 'ACTIVE',
    lastActive: '15 min ago',
    recentActivity: 'Shared KCSE tips',
  },
  {
    id: 3,
    name: 'PETER OCHIENG',
    handle: '@p_ochieng',
    avatar: 'PO',
    followers: 1234,
    posts: 87,
    engagement: 45,
    status: 'INACTIVE',
    lastActive: '3 hours ago',
    recentActivity: 'Commented on results release',
  },
  {
    id: 4,
    name: 'GRACE MUTHONI',
    handle: '@grace_ke',
    avatar: 'GM',
    followers: 8901,
    posts: 412,
    engagement: 88,
    status: 'ACTIVE',
    lastActive: '5 min ago',
    recentActivity: 'Live streaming study session',
  },
];

const MOCK_POSTS = [
  { user: 'MARY WANJIKU', content: 'Just finished revising Physics! #KCSE2024 #StudyMode', likes: 234, shares: 45, time: '5m' },
  { user: 'JOHN KAMAU', content: 'Anyone have notes for Chemistry Paper 2? DM me! 📚', likes: 89, shares: 12, time: '12m' },
  { user: 'GRACE MUTHONI', content: 'Good luck to all candidates! You got this! 💪', likes: 567, shares: 123, time: '23m' },
  { user: 'PETER OCHIENG', content: 'Waiting for results like... 😅 #Anxiety', likes: 345, shares: 67, time: '1h' },
];

const TRENDING_TOPICS = [
  '#KCSE2024',
  '#ExamResults',
  '#KNECPortal',
  '#StudyTips',
  '#FormFour',
  '#UniversityPlacement',
];

const SocialMediaModule = ({ dangerMode }: SocialMediaModuleProps) => {
  const [selectedProfile, setSelectedProfile] = useState(MOCK_PROFILES[0]);
  const [scanningProfile, setScanningProfile] = useState(false);
  const [liveCount, setLiveCount] = useState(1234);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 10) - 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleProfileSelect = (profile: typeof MOCK_PROFILES[0]) => {
    setScanningProfile(true);
    setTimeout(() => {
      setSelectedProfile(profile);
      setScanningProfile(false);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg ${dangerMode ? 'border-destructive/30' : 'border-primary/30'} bg-card/30 p-4`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Users className={`w-5 h-5 ${dangerMode ? 'text-destructive' : 'text-primary'}`} />
        <h3 className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
          SOCIAL MEDIA INTELLIGENCE
        </h3>
        <span className="ml-auto flex items-center gap-2 text-xs">
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-green-500"
          />
          <span className="text-green-500">{liveCount.toLocaleString()} LIVE</span>
        </span>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {/* Profile List */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <AtSign className="w-3 h-3" />
            TRACKED PROFILES
          </div>
          {MOCK_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => handleProfileSelect(profile)}
              className={`w-full text-left p-2 rounded text-xs transition-all ${
                selectedProfile.id === profile.id
                  ? dangerMode 
                    ? 'bg-destructive/20 border border-destructive' 
                    : 'bg-primary/20 border border-primary'
                  : 'bg-background/50 border border-transparent hover:border-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  dangerMode ? 'bg-destructive/30 text-destructive' : 'bg-primary/30 text-primary'
                }`}>
                  {profile.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground truncate">{profile.name}</div>
                  <div className="text-muted-foreground">{profile.handle}</div>
                </div>
                <div className={`w-2 h-2 rounded-full ${profile.status === 'ACTIVE' ? 'bg-green-500' : 'bg-muted'}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {scanningProfile ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
              >
                <div className={`w-8 h-8 border-2 ${dangerMode ? 'border-destructive/30 border-t-destructive' : 'border-primary/30 border-t-primary'} rounded-full animate-spin`} />
                <span className={`ml-3 text-sm ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                  EXTRACTING PROFILE DATA...
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded border ${dangerMode ? 'border-destructive/30 bg-destructive/5' : 'border-primary/30 bg-primary/5'}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                    dangerMode ? 'bg-destructive/30 text-destructive' : 'bg-primary/30 text-primary'
                  }`}>
                    {selectedProfile.avatar}
                  </div>
                  <div>
                    <div className={`font-bold text-lg ${dangerMode ? 'text-destructive' : 'text-foreground'}`}>
                      {selectedProfile.name}
                    </div>
                    <div className="text-muted-foreground text-sm">{selectedProfile.handle}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Last active: {selectedProfile.lastActive}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className={`p-3 rounded text-center ${dangerMode ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    <div className={`text-xl font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>
                      {selectedProfile.followers.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">FOLLOWERS</div>
                  </div>
                  <div className={`p-3 rounded text-center ${dangerMode ? 'bg-destructive/10' : 'bg-secondary/10'}`}>
                    <div className={`text-xl font-bold ${dangerMode ? 'text-destructive' : 'text-secondary'}`}>
                      {selectedProfile.posts}
                    </div>
                    <div className="text-xs text-muted-foreground">POSTS</div>
                  </div>
                  <div className={`p-3 rounded text-center ${dangerMode ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                    <div className="text-xl font-bold text-green-500">
                      {selectedProfile.engagement}%
                    </div>
                    <div className="text-xs text-muted-foreground">ENGAGEMENT</div>
                  </div>
                </div>

                <div className={`p-3 rounded ${dangerMode ? 'bg-background/50' : 'bg-background/30'}`}>
                  <div className="text-xs text-muted-foreground mb-1">RECENT ACTIVITY</div>
                  <div className="text-sm text-foreground">{selectedProfile.recentActivity}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Feed */}
          <div className="mt-4 space-y-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              LIVE FEED INTERCEPT
            </div>
            {MOCK_POSTS.map((post, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-2 rounded text-xs ${dangerMode ? 'bg-destructive/5 border border-destructive/20' : 'bg-background/50 border border-border'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-bold ${dangerMode ? 'text-destructive' : 'text-primary'}`}>{post.user}</span>
                  <span className="text-muted-foreground">{post.time}</span>
                </div>
                <div className="text-foreground mb-2">{post.content}</div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                  <span className="flex items-center gap-1"><Share2 className="w-3 h-3" /> {post.shares}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Trending & Stats */}
        <div className="space-y-4">
          <div>
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              TRENDING TOPICS
            </div>
            <div className="space-y-1">
              {TRENDING_TOPICS.map((topic, i) => (
                <div
                  key={topic}
                  className={`p-2 rounded text-xs flex items-center gap-2 ${dangerMode ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}
                >
                  <Hash className="w-3 h-3" />
                  <span className="font-bold">{topic}</span>
                  <span className="ml-auto text-muted-foreground">
                    {Math.floor(Math.random() * 50 + 10)}K
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`p-3 rounded ${dangerMode ? 'bg-destructive/10' : 'bg-primary/10'}`}>
            <div className="text-xs text-muted-foreground mb-2">SENTIMENT ANALYSIS</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-500">POSITIVE</span>
                <span className="text-green-500">67%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-green-500" />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-yellow-500">NEUTRAL</span>
                <span className="text-yellow-500">23%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-destructive">NEGATIVE</span>
                <span className="text-destructive">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SocialMediaModule;

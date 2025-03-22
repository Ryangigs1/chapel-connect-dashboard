
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useAuth } from '@/lib/auth';
import { addComment, getRecentComments } from '@/lib/firebase/auth';
import { useToast } from '@/components/ui/use-toast';
import { ThumbsUp, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  likes: number;
  user: {
    name: string;
    avatarUrl?: string;
    uid: string;
  };
}

export function Comments() {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingComments, setFetchingComments] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setFetchingComments(true);
      const recentComments = await getRecentComments(20);
      setComments(recentComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setFetchingComments(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to post a comment.',
        variant: 'destructive',
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Empty comment',
        description: 'Please enter a comment before submitting.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await addComment(user.id, comment);
      setComment('');
      toast({
        title: 'Comment added',
        description: 'Your comment has been posted successfully.',
      });
      
      // Refresh comments
      await fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post your comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Unknown date';
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Community Comments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
              <AvatarFallback>
                {user ? getInitials(user.name) : 'GU'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={isAuthenticated ? "Share your thoughts..." : "Sign in to comment"}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none h-24"
                disabled={!isAuthenticated || loading}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!isAuthenticated || loading} className="flex gap-2 items-center">
              <Send className="h-4 w-4" />
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>

        {/* Comments list */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Recent Comments</h3>
          
          {fetchingComments ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((item) => (
              <div key={item.id} className="flex gap-3 border-b pb-4">
                <Avatar>
                  <AvatarImage src={item.user.avatarUrl} alt={item.user.name} />
                  <AvatarFallback>{getInitials(item.user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{item.user.name}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm">{item.content}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {item.likes || 0}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        {!fetchingComments && comments.length > 0 && (
          <Button variant="outline" size="sm" onClick={fetchComments}>
            Refresh Comments
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default Comments;

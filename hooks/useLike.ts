import axios from "axios";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import usePost from "./usePost";
import usePosts from "./usePosts";

const useLike = ({ postId, userId }: { postId: string, userId?: string }) => {
  // Fetch current user and post data
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts(userId);

  // Handle login modal
  const loginModal = useLoginModal();

  // Determine if the current user has liked the post
  const hasLiked = useMemo(() => {
    const list = fetchedPost?.likedIds || [];
    return list.includes(currentUser?.id);
  }, [fetchedPost, currentUser]);

  // Toggle like status on the post
  const toggleLike = useCallback(async () => {
    if (!currentUser) {
      // Open login modal if user is not logged in
      return loginModal.onOpen();
    }

    try {
      let request;

      // Define the request based on like status
      if (hasLiked) {
        request = () => axios.delete('/api/like', { data: { postId } });
      } else {
        request = () => axios.post('/api/like', { postId });
      }

      // Execute the request
      await request();
      // Update post data
      mutateFetchedPost();
      mutateFetchedPosts();

      // Show success message
      toast.success('Success');
    } catch (error) {
      // Show error message
      toast.error('Something went wrong');
    }
  }, [
    currentUser, 
    hasLiked, 
    postId, 
    mutateFetchedPosts, 
    mutateFetchedPost, 
    loginModal
  ]);

  return {
    hasLiked,
    toggleLike,
  }
}

export default useLike;

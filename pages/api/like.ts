import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Only allow POST and DELETE methods
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).end();
  }

  try {
    const { postId } = req.body;

    // Authenticate the current user
    const { currentUser } = await serverAuth(req, res);

    // Validate postId
    if (!postId || typeof postId !== 'string') {
      throw new Error('Invalid ID');
    }

    // Fetch the post
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    // Check if post exists
    if (!post) {
      throw new Error('Invalid ID');
    }

    // Initialize likedIds array
    let updatedLikedIds = [...(post.likedIds || [])];

    if (req.method === 'POST') {
      // Add current user's ID to likedIds
      updatedLikedIds.push(currentUser.id);
      
      // Notification part starts
      try {
        const post = await prisma.post.findUnique({
          where: {
            id: postId,
          }
        });
    
        // Create notification if post has a user
        if (post?.userId) {
          await prisma.notification.create({
            data: {
              body: 'Someone liked your tweet!',
              userId: post.userId
            }
          });
    
          // Update user's notification status
          await prisma.user.update({
            where: {
              id: post.userId
            },
            data: {
              hasNotification: true
            }
          });
        }
      } catch(error) {
        console.log(error);
      }
      // Notification part ends
    }

    if (req.method === 'DELETE') {
      // Remove current user's ID from likedIds
      updatedLikedIds = updatedLikedIds.filter((likedId) => likedId !== currentUser?.id);
    }

    // Update the post with new likedIds
    const updatedPost = await prisma.post.update({
      where: {
        id: postId
      },
      data: {
        likedIds: updatedLikedIds
      }
    });

    // Return the updated post
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.log(error);
    // Handle errors
    return res.status(400).end();
  }
}

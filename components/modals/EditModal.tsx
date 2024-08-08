import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";

import Input from "../Input";
import Modal from "../Modal";

const EditModal = () => {
  const { data: currentUser } = useCurrentUser(); // Fetch current user data
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id); // Get mutate function for user data
  const editModal = useEditModal(); // Manage modal state

  // State for form inputs
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  // Initialize form with current user data
  useEffect(() => {
    setProfileImage(currentUser?.profileImage)
    setCoverImage(currentUser?.coverImage)
    setName(currentUser?.name)
    setUsername(currentUser?.username)
    setBio(currentUser?.bio)
  }, [currentUser?.name, currentUser?.username, currentUser?.bio, currentUser?.profileImage, currentUser?.coverImage]);

  const [isLoading, setIsLoading] = useState(false);

  // Handle form submission
  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true); // Start loading

      await axios.patch('/api/edit', {  // Send update request
        name, 
        username, 
        bio, 
        profileImage, 
        coverImage
      });
      mutateFetchedUser(); // Trigger revalidation of user data

      toast.success('Updated'); // Show success message

      editModal.onClose(); // Close modal
    } catch (error) {
      toast.error('Something went wrong'); // Show error message
    } finally {
      setIsLoading(false); // End loading
    }
  }, [editModal, name, username, bio, mutateFetchedUser, profileImage, coverImage]);

  // Define modal body content
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        value={name}
        disabled={isLoading}  
      />
      <Input 
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        disabled={isLoading} 
      />
      <Input 
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        disabled={isLoading} 
      />
    </div>
  )

  return (
    <Modal
      disabled={isLoading}
      isOpen={editModal.isOpen}
      title="Edit your profile"
      actionLabel="Save"
      onClose={editModal.onClose}
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
}

export default EditModal;

import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";

import useUser from "@/hooks/useUser";

interface AvatarProps {
  userId: string;
  isLarge?: boolean;
  hasBorder?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ 
  userId, 
  isLarge, 
  hasBorder 
}) => {
  const router = useRouter();

  const { data: fetchedUser } = useUser(userId); // fetch user info

  const onClick = useCallback((event: any) => { // memoziation
    event.stopPropagation(); // prevent dom propagation

    const url = `/users/${userId}`;

    router.push(url);
  }, [router, userId]); // dependence for usecallback


  return (
    <div
      className={`
        ${hasBorder ? 'border-4 border-black' : ''}
        ${isLarge ? 'h-32' : 'h-12'}
        ${isLarge ? 'w-32' : 'w-12'}
        rounded-full 
        hover:opacity-90 
        transition 
        cursor-pointer
        relative
      `}
    >
      <Image
        fill
        style={{
          objectFit: 'cover', // without distortion
          borderRadius: '100%'
        }}
        alt="Avatar"
        onClick={onClick}
        src={fetchedUser?.profileImage || '/images/placeholder.png'}
      />
    </div>
  );
}
 
export default Avatar;
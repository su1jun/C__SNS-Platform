interface DropzoneProps {
  onChange: (base64: string) => void;
  label: string;
  value?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<DropzoneProps> = ({ 
  onChange, 
  label, 
  value, 
  disabled 
}) => {
  return ( 
    <div></div>
   );
}
 
export default ImageUpload;
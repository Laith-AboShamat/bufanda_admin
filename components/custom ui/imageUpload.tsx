import { CldUploadWidget } from "next-cloudinary";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onRemove,
  value,
}) => {

    const onUpload = (result: any) =>{
        onChange(result.info.secure_url);
    }

  return (
    <CldUploadWidget uploadPreset="bufandapre" onUpload={onUpload}>
      {({ open }) => {
        return (
          <Button onClick={() => open()} className="bg-grey-1 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Upload Image
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

export default ImageUpload;

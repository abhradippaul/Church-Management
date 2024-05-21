import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { ChangeEvent, memo } from "react";

interface CustomFormInputProps extends InputProps {
  label: string;
  control: any;
  inputName: string;
  imageUpload?: ((e: ChangeEvent<HTMLInputElement>) => void) | null;
}

function CustomFormInput({
  control,
  label,
  inputName,
  disabled = false,
  required = true,
  type = "text",
  placeholder,
  autoComplete,
  imageUpload,
}: CustomFormInputProps) {
  return (
    <div>
      <div className="my-4"></div>
      <FormField
        control={control}
        name={inputName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label} : </FormLabel>
            <FormControl>
              <Input
                placeholder={placeholder}
                type={type}
                required={required}
                disabled={disabled}
                {...field}
                autoComplete={autoComplete}
                onChange={(e) => {
                  field.onChange(e);
                  if (imageUpload) {
                    imageUpload(e);
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export default memo(CustomFormInput);

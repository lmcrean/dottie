import { EyeIcon, EyeClosed } from "lucide-react";
import { FormInput } from "./!to-migrate/form-input";

interface PasswordInputProps {
    id: string;
    label?: string;
    autoComplete?: string;
    register: any;
    error?: string;
    required?: boolean;
    placeholder?: string;
    isVisible: boolean;
    toggleVisibility: () => void;
  }
  

export const PasswordInput = ({
    id,
    label = "Password",
    autoComplete = "current-password",
    register,
    error,
    required = false,
    placeholder,
    isVisible,
    toggleVisibility,
  }: PasswordInputProps) => {
    const icon = isVisible ? <EyeIcon size={18} /> : <EyeClosed size={18} />;
  
    return (
        <FormInput
          id={id}
          type={isVisible ? "text" : "password"}
          label={label}
          autoComplete={autoComplete}
          required={required}
          placeholder={placeholder}
          {...register(id)}
          error={error}
          className="pr-10 border dark:border-slate-800"
          iconRight={
            <span onClick={toggleVisibility}>
              {icon}
            </span>
          }
        />
      );
    };

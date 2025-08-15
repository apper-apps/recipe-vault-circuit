import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required,
  multiline,
  rows,
  ...props 
}) => {
  const Component = multiline ? TextArea : Input;
  
  return (
    <div className="space-y-1">
      <Label required={required}>{label}</Label>
      <Component
        type={type}
        error={error}
        rows={multiline ? rows : undefined}
        {...props}
      />
      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;
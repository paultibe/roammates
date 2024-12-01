import Image from 'next/image';

interface TextBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function TextBox({
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  className = '',
  style = {},
  onKeyDown
}: TextBoxProps) {
  return (
    <div className={`relative ${className}`} style={style}>
      <Image
        src="/assets/text-box.png"
        alt={`${placeholder} Input Background`}
        width={300}
        height={45}
        className="w-full"
      />
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="absolute inset-0 bg-transparent text-black px-4 outline-none"
        placeholder={placeholder}
        required={required}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}

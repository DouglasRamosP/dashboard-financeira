import { EyeIcon, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Button } from './ui/button'
import { Input } from './ui/input'

const PasswordInput = ({ placeholder }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
      ></Input>
      <Button
        variant="ghost"
        className="absolute bottom-0 right-0 top-0 my-auto mr-1 h-8 w-8 text-muted-foreground"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <EyeOff /> : <EyeIcon />}
      </Button>
    </div>
  )
}

export default PasswordInput

import { Button } from './components/ui/button'

const App = () => {
  return (
    <div>
      <h1 className="my-2 p-5 text-red-500">Welcome to my React App!</h1>
      <p>This is a simple React application.</p>
      <Button
        className="bg-black text-white hover:bg-blue-600"
        variant="outline"
      >
        Click Me
      </Button>
    </div>
  )
}

export default App

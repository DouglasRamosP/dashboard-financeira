import { Link } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Pagina nao encontrada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A rota que voce tentou acessar nao existe ou ainda nao foi criada.
          </p>
          <Button asChild>
            <Link to="/">Voltar ao inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NotFoundPage

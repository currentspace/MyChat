import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/lib/auth/auth-hooks'
import { Button } from '@/components/ui/styled/button'
import * as Avatar from '@/components/ui/styled/avatar'
import * as Popover from '@/components/ui/styled/popover'
import { css } from '@/styled-system/css'
import { HStack, VStack } from '@/styled-system/jsx'

export function LoginButton() {
  const { user, loading, login, logout } = useAuth()

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button variant="ghost" size="sm">
            <HStack gap="2">
              <Avatar.Root size="xs">
                <Avatar.Image src={user.picture} alt={user.name} />
                <Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
              </Avatar.Root>
              <span className={css({ display: { base: 'none', md: 'block' } })}>
                {user.name}
              </span>
            </HStack>
          </Button>
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content>
            <VStack gap="3" alignItems="stretch">
              <div className={css({ borderBottom: '1px solid', borderColor: 'border.muted', pb: 3 })}>
                <p className={css({ fontWeight: 'medium' })}>{user.name}</p>
                <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>{user.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => { void logout() }}>
                Sign out
              </Button>
            </VStack>
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>
    )
  }

  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        if (credentialResponse.credential) {
          void login(credentialResponse.credential)
        }
      }}
      onError={() => {
        console.error('Login Failed')
      }}
      useOneTap
      theme="outline"
      size="medium"
      text="signin_with"
      shape="rectangular"
    />
  )
}
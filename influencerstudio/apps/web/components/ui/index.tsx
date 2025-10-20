// Central UI barrel re-exporting shadcn-style components
// from the shared UI package plus local wrappers.

export { Button } from '../../../../packages/ui/src/button'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../../../packages/ui/src/card'

export { Input } from '../../../../packages/ui/src/input'
export { Skeleton } from '../../../../packages/ui/src/skeleton'
export { Toast } from '../../../../packages/ui/src/toast'
export type { ToastProps } from '../../../../packages/ui/src/toast'

// Local-only components that aren't in the shared package
// Note: paths are case-sensitive in production (Vercel/Linux)
export { Avatar } from './Avatar'
export { Separator } from './Separator'
export { Tooltip } from './Tooltip'

/**
 * @types ErrorMessage
 * @summary Type definitions for ErrorMessage component
 */

export interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

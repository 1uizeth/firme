export class StringUtils {
  static clsx(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
  }
} 
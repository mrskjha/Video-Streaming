
export const Footer = () => {
  return (
    <footer className="relative mx-auto  my-10 flex max-w-7xl flex-col items-center justify-center">
      <p className="text-xl text-neutral-500 dark:text-neutral-400">
        &copy; {new Date().getFullYear()} StreamHub — Empowering your entertainment. Built with ❤️ by Sunny Kumar.
      </p>
    </footer>
  );
}
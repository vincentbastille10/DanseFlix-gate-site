// pages/login.js

export default function LoginRedirect() {
  // Redirection fallback pour les navigateurs sans JS
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
  return null;
}

// Redirection côté serveur (Next.js 14 page router)
export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}

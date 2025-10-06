export const getImageUrl = (path?: string) => {
  if (!path) return "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
  return `http://localhost:3001${path}`;
};

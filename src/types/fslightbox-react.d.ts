declare module 'fslightbox-react' {
  interface FsLightboxProps {
    toggler: boolean;
    sources: string[];
    [key: string]: any;
  }

  const FsLightbox: React.FC<FsLightboxProps>;
  export default FsLightbox;
}


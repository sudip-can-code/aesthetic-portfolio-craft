
import { Download } from "lucide-react";
import { Button } from "./ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const handleDownloadCV = () => {
    window.open('https://drive.google.com/drive/folders/1oiS7SySJeBGRDFnrAB-WXxL_1EWrNOJt?usp=sharing', '_blank');
  };
  
  return (
    <footer className="py-8 bg-background">
      <div className="container mx-auto">
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-lg">Sudip Sunuwar</h3>
              <p className="text-sm text-muted-foreground">Video Editor & Graphic Designer</p>
            </div>
            
            {/* Download CV Button */}
            <div className="mb-4 md:mb-0">
              <Button 
                onClick={handleDownloadCV}
                className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
                <Download className="mr-2 h-4 w-4" />
                Download My CV
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {currentYear} All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

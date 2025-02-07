import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-700 text-white text-center py-4 mt-auto">
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Event Manager. All rights reserved.
      </Typography>
      <div className="mt-2">
        <Link
          to="/privacy"
          target="_blank"
          className="text-gray-300 mx-2 hover:underline"
        >
          Privacy Policy
        </Link>
        <Link
          to="/terms"
          target="_blank"
          className="text-gray-300 mx-2 hover:underline"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};

export default Footer;

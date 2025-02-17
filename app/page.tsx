import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {

  console.log(process.env.app_secret,"app_secret");
  
  return (
    <div className="container">
   <h1 className="text-info">hello world!</h1>
    </div>
  );
}

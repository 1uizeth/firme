import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Vitalik Buterin",
    username: "@vitalikbuterin",
    img: "https://pbs.twimg.com/profile_images/1895872023944937472/Uoyc5-p8_400x400.jpg",
  },
  {
    name: "Jesse Pollak",
    username: "@jessepollak",
    img: "https://pbs.twimg.com/profile_images/1874613416330977280/tKHErTUn_400x400.jpg",
  },
  {
    name: "Brian Armstrong",
    username: "@brian_armstrong",
    img: "https://pbs.twimg.com/profile_images/1516832438818770944/n77EwnKU_400x400.png",
  },
  {
    name: "Hayden Adams",
    username: "@haydenzadams",
    img: "https://pbs.twimg.com/profile_images/1600270205149761555/aIQ_R6PJ_400x400.jpg",
  },
  {
    name: "Dan Romero",
    username: "@dwr",
    img: "https://pbs.twimg.com/profile_images/1518670972559130624/-G9gNsOp_400x400.png",
  },
  {
    name: "Stani Kulechov",
    username: "@stanikulechov",
    img: "https://pbs.twimg.com/profile_images/1880993699661852672/RzdhDkv2_400x400.jpg",
  },
];

// Duplicate the reviews array to ensure continuous scrolling
const firstRow = [...reviews, ...reviews];

const ReviewCard = ({
  img,
  name,
}: {
  img: string;
  name: string;
}) => {
  return (
    <div className="group flex flex-col items-center space-y-3 w-28 mx-3 transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <img 
          className="rounded-full border-2 border-white shadow-lg transition-shadow duration-300 group-hover:shadow-xl" 
          width="72" 
          height="72" 
          alt={name}
          src={img} 
        />
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <p className="text-sm font-semibold text-gray-800 text-center leading-tight transition-colors duration-300 group-hover:text-gray-900">
        {name}
      </p>
    </div>
  );
};

export default function Hero() {
  return (
    <div className="relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
      
      {/* Main marquee */}
      <Marquee 
        pauseOnHover 
        className="[--duration:30s] py-8"
        repeat={2}
      >
        {reviews.map((review, index) => (
          <ReviewCard 
            key={`${review.username}-${index}`} 
            img={review.img} 
            name={review.name} 
          />
        ))}
      </Marquee>
      
      {/* Smooth gradient overlays that match the background */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent z-10" />
      
      {/* Top and bottom subtle borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
    </div>
  );
} 
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function HomepageCards() {
  return (
    <div className="flex gap-5 flex-row justify-between py-5">
      <Link
        href="savedLocations"
        className="w-full max-w-sm transition-transform duration-200 hover:scale-103"
      >
        <Card className="w-full max-w-sm flex flex-col justify-between h-90 bg-white/20 backdrop-blur-md text-white border border-white/30">
          <CardHeader className="mt-20">
            <CardTitle className="text-2xl font-bold">
              Saved Locations
            </CardTitle>
            <CardDescription className="text-gray-200">
              Click through to a list of your saved locations. You can add as
              many as you like.
            </CardDescription>
            {/* <CardAction>Card Action</CardAction> */}
          </CardHeader>
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
          <CardFooter className="flex justify-end">
            <p>View saved locations --------{">"} </p>
          </CardFooter>
        </Card>
      </Link>

      <Link
        href="continents"
        className="w-full max-w-sm transition-transform duration-200 hover:scale-103"
      >
        <Card
          className="w-full max-w-sm flex flex-col justify-between h-90 bg-white/20 backdrop-blur-md text-white border border-white/30
"
        >
          <CardHeader className="mt-20">
            <CardTitle className="text-2xl font-bold">
              View Capitals by Continent
            </CardTitle>
            <CardDescription className="text-gray-200">
              Click through to find and view a capital city in your preferred
              country.
            </CardDescription>
            {/* <CardAction>Card Action</CardAction> */}
          </CardHeader>
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
          <CardFooter className="flex justify-end">
            <p>View continents --------{">"} </p>
          </CardFooter>
        </Card>
      </Link>

      <Link
        href="savedLocations"
        className="w-full max-w-sm transition-transform duration-200 hover:scale-103"
      >
        <Card
          className="w-full max-w-sm flex flex-col justify-between h-90 bg-white/20 backdrop-blur-md text-white border border-white/30
"
        >
          <CardHeader className="mt-20">
            <CardTitle className="text-2xl font-bold">
              Explore and Compare
            </CardTitle>
            <CardDescription className="text-gray-200">
              Click through to search for a desired location. You can compare
              two locations.
            </CardDescription>
            {/* <CardAction>Card Action</CardAction> */}
          </CardHeader>
          {/* <CardContent>
          <p>Card Content</p>
        </CardContent> */}
          <CardFooter className="flex justify-end">
            <p>Explore locations --------{">"} </p>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}

//  className="w-full max-w-sm"

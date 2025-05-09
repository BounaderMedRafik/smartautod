import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

const NotAuthorized = () => {
  return (
    <Card className="max-w-2xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Not Authorized</CardTitle>
      </CardHeader>
      <CardContent>
        <p>You must be logged in to view this content</p>
      </CardContent>
      <CardFooter>
        <p>
          <Link className="underline text-primary" href={"/"}>
            Sign In
          </Link>{" "}
          or{" "}
          <Link className="underline text-primary" href="/auth/register">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default NotAuthorized;

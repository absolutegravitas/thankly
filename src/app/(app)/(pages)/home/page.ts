// app/home/page.js
import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect the user to the homepage ('/')
  redirect('/');
}
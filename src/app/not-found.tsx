import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='w-full h-[60vh]  flex flex-col gap-14 justify-center items-center'>
      <h1 className='text-3xl font-bold'>Page not found</h1>
      <Link href={"/"}>
        <button className='bg-primary px-5 py-3 text-white font-semibold rounded-lg hover:bg-white hover:text-black'>Go Back To Home</button>
      </Link>
    </div>
  );
}

function Page() {
  return (
    <div>
      <div className="hidden [@media(min-width:1915px)]:block bg-green-500 text-white p-4">
        Only visible on 1921px+ screen
      </div>
    </div>
  );
}

export default Page;
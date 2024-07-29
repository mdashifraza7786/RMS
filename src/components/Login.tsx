"use client"
function Login() {
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem('islogged', 'true');
    window.location.reload();
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[400px] px-5 py-6 bg-white rounded-md flex flex-col gap-7">
        <h1 className="font-medium uppercase text-3xl text-center tracking-widest">Login</h1>
        <div>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              <input
                className="py-3 px-3 border-2 border-gray-300"
                type="text"
                name="userid"
                placeholder="Enter UserID"
                required
              />
              <input
                className="py-3 px-3 border-2 border-gray-300"
                type="password"
                name="password"
                placeholder="Enter Password"
                required
              />
              <button className="bg-primary py-3 px-5 text-center text-white font-semibold border-none">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

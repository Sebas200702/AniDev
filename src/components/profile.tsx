export const Profile = () => {
  return (
    <div className="flex items-center justify-end gap-4">
      <div className="hidden text-end font-medium md:block dark:text-white">
        <div>Jese Leos</div>
        <div className="text-end text-sm text-gray-500 dark:text-gray-400">
          Joined in August 2014
        </div>
      </div>
      <img
        className="h-10 w-10 rounded-full"
        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
        alt=""
      />
    </div>
  )
}

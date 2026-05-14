const CardSkeleton = () => (
  <div className="my-2 flex w-full flex-col border border-gray-100 bg-white shadow-md animate-pulse">
    <div className="w-full aspect-[3/4] bg-gray-200" />
    <div className="flex flex-col pb-2 px-4 pt-2 gap-2">
      <div className="h-3 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const CartSkeleton = () => (
  <div className="w-10/12 flex flex-col md:flex-row items-center md:items-start justify-center py-2 animate-pulse">
    <div className='w-full md:w-2/3 flex flex-col px-6 py-3 border-r'>
      <div className='h-5 bg-gray-200 rounded w-1/4 mb-4' />
      {[1, 2, 3].map(i => (
        <div key={i} className='flex flex-row items-center gap-4 py-4 border-t'>
          <div className='h-24 w-24 bg-gray-200 rounded flex-shrink-0' />
          <div className='flex flex-col gap-2 w-full'>
            <div className='h-3 bg-gray-200 rounded w-3/4' />
            <div className='h-3 bg-gray-200 rounded w-1/4' />
            <div className='h-3 bg-gray-200 rounded w-1/3' />
          </div>
        </div>
      ))}
    </div>
    <div className='w-11/12 md:w-1/3 mt-4 md:mt-0 py-2 px-6'>
      <div className='h-5 bg-gray-200 rounded w-1/2 mb-4' />
      <div className='flex flex-col gap-3 mt-4'>
        <div className='h-3 bg-gray-200 rounded w-full' />
        <div className='h-3 bg-gray-200 rounded w-full' />
      </div>
      <div className='h-10 bg-gray-200 rounded w-full mt-8' />
    </div>
  </div>
);

const CheckoutSkeleton = () => (
  <div className='w-10/12 flex flex-col md:flex-row items-start justify-center animate-pulse'>
    {/* Left: address form skeleton */}
    <div className='w-full border-r py-4 px-6'>
      <div className='h-6 bg-gray-200 rounded w-1/3 mb-4' />
      <div className='flex flex-row gap-4 mb-4'>
        <div className='w-full h-12 bg-gray-200 rounded' />
        <div className='w-full h-12 bg-gray-200 rounded' />
      </div>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className='h-12 bg-gray-200 rounded mb-4' />
      ))}
      <div className='flex flex-row gap-4'>
        <div className='w-full h-12 bg-gray-200 rounded' />
        <div className='w-full h-12 bg-gray-200 rounded' />
      </div>
    </div>
    {/* Right: order summary skeleton */}
    <div className="w-full flex flex-col px-6 py-4">
      <div className='h-6 bg-gray-200 rounded w-1/3 mb-4' />
      {[1, 2].map(i => (
        <div key={i} className='flex flex-row items-center gap-4 py-3 border-t'>
          <div className='h-24 w-24 bg-gray-200 rounded flex-shrink-0' />
          <div className='flex flex-col gap-2 w-full'>
            <div className='h-3 bg-gray-200 rounded w-3/4' />
            <div className='h-3 bg-gray-200 rounded w-1/4' />
            <div className='h-3 bg-gray-200 rounded w-1/3' />
          </div>
        </div>
      ))}
      <div className='mt-4 flex flex-col gap-2 px-4'>
        <div className='h-3 bg-gray-200 rounded w-full' />
        <div className='h-3 bg-gray-200 rounded w-full' />
        <div className='h-4 bg-gray-200 rounded w-full mt-1' />
      </div>
      <div className='h-10 bg-gray-200 rounded w-full mt-6' />
    </div>
  </div>
);

const OrdersSkeleton = () => (
  <div className='flex flex-col w-full items-center justify-center mt-8 animate-pulse'>
    {[1, 2, 3].map(i => (
      <div key={i} className='w-full px-8 mb-4'>
        <div className='w-full border rounded p-4 flex flex-row gap-4'>
          <div className='h-24 w-24 bg-gray-200 rounded flex-shrink-0' />
          <div className='flex flex-col gap-2 w-full'>
            <div className='h-3 bg-gray-200 rounded w-1/2' />
            <div className='h-3 bg-gray-200 rounded w-1/4' />
            <div className='h-3 bg-gray-200 rounded w-1/3' />
            <div className='h-3 bg-gray-200 rounded w-1/4' />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const WishlistSkeleton = () => (
  <div className='w-full grid lg:grid-cols-3 lg:gap-y-8 lg:gap-x-24 md:grid-cols-2 md:gap-x-12 md:gap-y-8 grid-cols-1 gap-y-6 animate-pulse px-8'>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex flex-col border border-gray-100 bg-white shadow-md">
        <div className="w-full aspect-[3/4] bg-gray-200" />
        <div className="flex flex-col pb-2 px-4 pt-2 gap-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    ))}
  </div>
);

const ProductSkeleton = () => (
  <div className="animate-pulse w-11/12">
    <div className="lg:mt-8 mt-4 grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">
      {/* Image skeleton */}
      <div className="lg:col-span-3">
        <div className="w-full aspect-[11/12] bg-gray-200 rounded" />
      </div>
      {/* Details skeleton */}
      <div className="lg:col-span-2 flex flex-col gap-4 px-4">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4 mt-4" />
        <div className="flex gap-2">
          {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 bg-gray-200 rounded" />)}
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mt-4" />
        <div className="flex gap-2">
          {[1,2,3,4,5,6].map(i => <div key={i} className="w-12 h-10 bg-gray-200 rounded" />)}
        </div>
        <div className="flex gap-4 mt-6">
          <div className="h-12 bg-gray-200 rounded w-48" />
          <div className="h-12 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className='w-11/12 flex md:flex-row flex-col items-start justify-center pt-8 animate-pulse'>
    <div className='md:w-1/4 w-full border border-gray-200 flex md:flex-col flex-row items-center justify-start'>
      <div className='h-7 bg-gray-200 rounded w-1/2 my-3 mx-2 md:mx-0' />
      <div className='py-2 border w-full flex flex-row items-center justify-center md:mx-0 mx-4'>
        <div className='rounded-full w-8 h-8 bg-gray-200 mx-2 flex-shrink-0' />
        <div className='h-4 bg-gray-200 rounded w-1/2' />
      </div>
      <div className='flex flex-col w-full items-center justify-start md:h-[64vh] md:pt-4 pt-2 gap-3'>
        <div className='h-4 bg-gray-200 rounded w-1/3' />
        <div className='h-4 bg-gray-200 rounded w-1/3' />
      </div>
    </div>
    <div className='md:w-3/4 w-full flex flex-col px-6 py-4 gap-4'>
      <div className='h-6 bg-gray-200 rounded w-1/4 mb-2' />
      <div className='flex flex-row gap-4'>
        <div className='w-full flex flex-col gap-2'>
          <div className='h-3 bg-gray-200 rounded w-1/3' />
          <div className='h-10 bg-gray-200 rounded w-full' />
        </div>
        <div className='w-full flex flex-col gap-2'>
          <div className='h-3 bg-gray-200 rounded w-1/3' />
          <div className='h-10 bg-gray-200 rounded w-full' />
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className='flex flex-col gap-2'>
          <div className='h-3 bg-gray-200 rounded w-1/4' />
          <div className='h-10 bg-gray-200 rounded w-full' />
        </div>
      ))}
      <div className='h-10 bg-gray-200 rounded w-full mt-2' />
    </div>
  </div>
);

const PaymentStatusSkeleton = () => (
  <div className='w-full flex flex-col justify-center items-center pt-32 pb-24 animate-pulse'>
    <div className='w-3/5 bg-gray-200 rounded-md p-4 flex flex-col gap-3'>
      <div className='flex flex-row justify-between'>
        <div className='flex flex-row gap-2 items-center'>
          <div className='h-8 w-8 bg-gray-300 rounded-full' />
          <div className='h-6 bg-gray-300 rounded w-32' />
        </div>
        <div className='h-4 bg-gray-300 rounded w-24' />
      </div>
      <div className='h-3 bg-gray-300 rounded w-full' />
      <div className='h-3 bg-gray-300 rounded w-2/3' />
    </div>
    <div className='h-10 bg-gray-200 rounded w-60 mt-12' />
  </div>
);

const PaymentSkeleton = () => (
      <div className='w-11/12 flex flex-col md:flex-row items-start justify-center animate-pulse'>
          <div className='w-full border-r py-3 px-6'>
            <div className='h-6 bg-gray-200 rounded w-1/3 mb-4' />
            <div className='w-full border rounded mb-4'>
              <div className='h-10 bg-gray-100 border-b' />
              <div className='h-16 bg-gray-100' />
            </div>
            <div className='h-5 bg-gray-200 rounded w-1/4 mb-3 mt-4' />
            <div className='w-full border rounded'>
              <div className='h-12 bg-gray-100 border-b' />
              <div className='h-12 bg-gray-100' />
            </div>
            <div className='h-10 bg-gray-200 rounded mt-6' />
          </div>

          <div className="w-full flex flex-col px-6 py-3">
            <div className='h-6 bg-gray-200 rounded w-1/3 mb-4' />
            {[1, 2].map(i => (
              <div key={i} className='flex flex-row items-center gap-4 py-3 border-t'>
                <div className='h-28 w-28 bg-gray-200 rounded flex-shrink-0' />
                <div className='flex flex-col gap-2 w-full'>
                  <div className='h-3 bg-gray-200 rounded w-3/4' />
                  <div className='h-3 bg-gray-200 rounded w-1/4' />
                  <div className='h-3 bg-gray-200 rounded w-1/3' />
                </div>
              </div>
            ))}
            <div className='mt-4 flex flex-col gap-2 px-4'>
              <div className='h-3 bg-gray-200 rounded w-full' />
              <div className='h-3 bg-gray-200 rounded w-full' />
              <div className='h-4 bg-gray-200 rounded w-full mt-1' />
            </div>
          </div>
        </div>
    );

export { CardSkeleton, CartSkeleton, CheckoutSkeleton, OrdersSkeleton, WishlistSkeleton, ProductSkeleton, ProfileSkeleton, PaymentStatusSkeleton, PaymentSkeleton };
function UnsupportedDeviceIllustration({ className }: { className?: string }) {
  return (
    <svg
      width={162}
      height={122}
      viewBox="0 0 162 122"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Device not supported"
      className={className}
    >
      <path
        d="M151 1H11C5.47715 1 1 5.47715 1 11V91C1 96.5229 5.47715 101 11 101H151C156.523 101 161 96.5229 161 91V11C161 5.47715 156.523 1 151 1Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M56 39C57.6569 39 59 37.6569 59 36C59 34.3431 57.6569 33 56 33C54.3431 33 53 34.3431 53 36C53 37.6569 54.3431 39 56 39Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M106 39C107.657 39 109 37.6569 109 36C109 34.3431 107.657 33 106 33C104.343 33 103 34.3431 103 36C103 37.6569 104.343 39 106 39Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M51 66C71 52.6667 91 52.6667 111 66"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M61 101L51 121H111L101 101"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M41 121H121"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UnsupportedDeviceView() {
  return (
    <div
      role="region"
      aria-label="Unsupported device"
      data-slot="unsupported-device-view"
      className="flex flex-1 min-h-[70vh] flex-col items-center justify-center p-6 text-center font-roboto"
    >
      <UnsupportedDeviceIllustration className="mb-6 max-w-full h-auto text-[#2E2E2E] dark:text-zinc-100" />

      <h1 className="text-3xl font-medium text-[#2E2E2E] dark:text-zinc-100 mb-3">
        Oops
      </h1>

      <p className="max-w-md text-sm text-[#2E2E2E] dark:text-zinc-300 leading-relaxed">
        Device is not supported. CV Builder is optimized for tablet and desktop.
        <br />
        Please open on a larger screen.
      </p>
    </div>
  );
}

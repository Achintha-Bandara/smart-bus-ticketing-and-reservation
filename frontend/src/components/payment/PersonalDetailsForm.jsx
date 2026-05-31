const inputBase = "w-full border-2 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400 bg-white transition-colors"
const inputOk = "border-gray-200"
const inputErr = "border-red-400 focus:ring-red-400"

const Label = ({ children }) => (
  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{children}</label>
)
const ErrorMsg = ({ msg }) => msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null

export default function PersonalDetailsForm({ address, setAddress, city, setCity, state, setState, postalCode, setPostalCode, errors }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Billing Address</h2>
      <div className="flex flex-col gap-4">

        <div>
          <Label>Street Address</Label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="123 Main Street, Colombo 03"
            className={`${inputBase} ${errors?.address ? inputErr : inputOk}`}
          />
          <ErrorMsg msg={errors?.address} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>City</Label>
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Colombo"
              className={`${inputBase} ${errors?.city ? inputErr : inputOk}`}
            />
            <ErrorMsg msg={errors?.city} />
          </div>
          <div>
            <Label>District / Province</Label>
            <input
              type="text"
              value={state}
              onChange={e => setState(e.target.value)}
              placeholder="Western"
              className={`${inputBase} ${errors?.state ? inputErr : inputOk}`}
            />
            <ErrorMsg msg={errors?.state} />
          </div>
        </div>

        <div>
          <Label>Postal Code</Label>
          <input
            type="text"
            value={postalCode}
            onChange={e => setPostalCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 5))}
            placeholder="00300"
            inputMode="numeric"
            maxLength={5}
            className={`${inputBase} ${errors?.postalCode ? inputErr : inputOk}`}
          />
          <ErrorMsg msg={errors?.postalCode} />
        </div>

      </div>
    </div>
  )
}
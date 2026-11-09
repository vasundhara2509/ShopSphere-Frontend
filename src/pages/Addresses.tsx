
import { useEffect, useState } from 'react'
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  type Address,
  type AddressRequest,
} from '../services/addressService'
import '../App.css'

const emptyForm: AddressRequest = {
  fullName: '',
  phoneNumber: '',
  addressLine: '',
  city: '',
  state: '',
  postalCode: '',
  landmark: '',
  defaultAddress: false,
}

function Addresses() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [form, setForm] = useState<AddressRequest>({ ...emptyForm })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchAddresses = async () => {
    try {
      setError('')
      const data = await getAddresses()
      setAddresses(data)
    } catch (err) {
      console.error('Fetch addresses error:', err)
      setError('Unable to load addresses. Please login again if your session expired.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target

    setForm((previous) => ({
      ...previous,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingId !== null) {
        await updateAddress(editingId, form)
        alert('Address updated successfully!')
      } else {
        await addAddress(form)
        alert('Address added successfully!')
      }

      setForm({ ...emptyForm })
      setEditingId(null)
      await fetchAddresses()
    } catch (err) {
      console.error('Save address error:', err)
      setError('Unable to save address. Please check your details and try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setForm({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      landmark: address.landmark || '',
      defaultAddress: address.defaultAddress,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (addressId: number) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      await deleteAddress(addressId)
      setAddresses((previous) =>
        previous.filter((address) => address.id !== addressId)
      )
      alert('Address deleted successfully!')
    } catch (err) {
      console.error('Delete address error:', err)
      setError('Unable to delete address.')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setForm({ ...emptyForm })
    setError('')
  }

  if (loading) {
    return <div className="address-page"><p>Loading addresses...</p></div>
  }

  return (
    <div className="address-page">
      <h1>My Delivery Addresses</h1>
      <p>Manage your delivery addresses.</p>

      <form className="address-form" onSubmit={handleSubmit}>
        <h2>{editingId !== null ? 'Edit Address' : 'Add New Address'}</h2>

        {error && <p className="error-message">{error}</p>}

        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />

        <input
          name="phoneNumber"
          placeholder="10-digit Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          pattern="[0-9]{10}"
          maxLength={10}
          required
        />

        <textarea
          name="addressLine"
          placeholder="Address"
          value={form.addressLine}
          onChange={handleChange}
          maxLength={255}
          required
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />

        <input
          name="postalCode"
          placeholder="6-digit Postal Code"
          value={form.postalCode}
          onChange={handleChange}
          pattern="[0-9]{6}"
          maxLength={6}
          required
        />

        <input
          name="landmark"
          placeholder="Landmark (Optional)"
          value={form.landmark}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="defaultAddress"
            checked={form.defaultAddress}
            onChange={handleChange}
          />
          Set as default address
        </label>

        <button type="submit" disabled={saving}>
          {saving
            ? 'Saving...'
            : editingId !== null
              ? 'Update Address'
              : 'Save Address'}
        </button>

        {editingId !== null && (
          <button type="button" onClick={handleCancelEdit}>
            Cancel Edit
          </button>
        )}
      </form>

      <section className="address-list">
        <h2>Saved Addresses ({addresses.length})</h2>

        {addresses.length === 0 ? (
          <p>No addresses found. Add your first delivery address.</p>
        ) : (
          addresses.map((address) => (
            <div className="address-card" key={address.id}>
              <h3>{address.fullName}</h3>
              {address.defaultAddress && <span>Default Address</span>}
              <p>{address.phoneNumber}</p>
              <p>{address.addressLine}</p>
              <p>
                {address.city}, {address.state} - {address.postalCode}
              </p>
              {address.landmark && <p>Landmark: {address.landmark}</p>}

              <button type="button" onClick={() => handleEdit(address)}>
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(address.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </section>
    </div>
  )
}

export default Addresses

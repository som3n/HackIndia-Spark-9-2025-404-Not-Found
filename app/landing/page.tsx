import Header from '@/components/Header'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>

      <section>
        <Header />
      </section>
      <footer className="w-full bg-gray-800 text-white text-center py-2">
        <p className="text-sm">© 2025 PrepView. All rights reserved.</p>
      </footer>
    </>
  )
}

export default page

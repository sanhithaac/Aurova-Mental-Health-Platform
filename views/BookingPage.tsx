import React from 'react';
import PatientForm from '../components/PatientForm';

const BookingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-aura-cream dark:bg-background-dark flex flex-col items-center py-12">
      <div className="w-full max-w-2xl rounded-3xl border-2 border-black bg-white dark:bg-card-dark shadow-retro p-8 mx-auto">
        <h1 className="text-3xl font-display font-bold mb-2 text-primary">Health Care - 1</h1>
        <p className="text-lg text-gray-700 mb-6">Mental Wellness PreRequisite</p>
        <div className="mb-8">
          {/* Preview section */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-4">
            <span className="font-bold text-lg">Do u feel Lonely <span className="text-red-500">*</span></span>
            <div className="mt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-primary" />
                <span>Yes</span>
              </label>
            </div>
          </div>
        </div>
        {/* Full form section */}
        <PatientForm />
      </div>
    </div>
  );
};

export default BookingPage;

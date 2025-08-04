// Debug script to test environment variable
console.log('=== Environment Variable Debug ===');
console.log('ELECTION_TYPE:', process.env.ELECTION_TYPE);

const electionTypes = [
  'জাতীয় সংসদ নির্বাচন',
  'উপজেলা পরিষদ নির্বাচন',
  'পৌরসভা নির্বাচন',
  'ইউনিয়ন পরিষদ নির্বাচন',
  'সিটি কর্পোরেশন নির্বাচন',
];

const userElectionType = process.env.ELECTION_TYPE;

if (userElectionType) {
  console.log('User provided election type:', userElectionType);

  const foundType = electionTypes.find(
    (type) =>
      type.toLowerCase().includes(userElectionType.toLowerCase()) ||
      userElectionType.toLowerCase().includes(type.toLowerCase())
  );

  if (foundType) {
    console.log('✅ Found matching type:', foundType);
  } else {
    console.log('❌ No match found for:', userElectionType);
    console.log('Available types:');
    electionTypes.forEach((type, index) => {
      console.log(`   ${index + 1}. ${type}`);
    });
  }
} else {
  console.log('❌ No ELECTION_TYPE environment variable found');
  console.log('Will use random selection');
}

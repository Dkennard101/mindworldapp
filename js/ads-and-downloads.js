// ads-and-downloads.js
document.addEventListener('DOMContentLoaded', function() {
  const downloadButtons = document.querySelectorAll('.download-btn');

  downloadButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      // Trigger rewarded ad first
      showRewardedAd().then(success => {
        if(success) {
          // After ad, allow download or open embedded material
          window.alert('Ad watched! You can now access the material.');
          // Example: window.open('path-to-material', '_blank');
        } else {
          window.alert('You must watch the ad to access this material.');
        }
      });
    });
  });
});

function showRewardedAd() {
  return new Promise((resolve) => {
    // Placeholder for real ad integration (AdSense / AdMob)
    let watchedAd = confirm('Simulated ad: Click OK to simulate watching ad.');
    resolve(watchedAd);
  });
}

const fs = require('fs');
const path = require('path');

const baseDir = 'portfolio_assets';
const outputFilePath = 'portfolio_data.js';

const categoryMap = {
    'Brand_Identity': 'Visual Identity',
    'photo_poster': 'Visual Identity',
    'video_long': 'Video Production',
    'video_Motion_Graphics': 'Video Production',
    'video_reel_edit': 'Video Production',
    'video_3D': 'Video Production',
    'video_Social_Media_Ads': 'Video Production',
    'Client_Testimonials': 'Marketing'
};

function getFiles(dir, category) {
    const files = fs.readdirSync(dir);
    return files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.mp4', '.mov', '.webm'].includes(ext);
    }).map(file => {
        const ext = path.extname(file).toLowerCase();
        const type = ['.mp4', '.mov', '.webm'].includes(ext) ? 'video' : 'image';
        return {
            title: file.split('.')[0].replace(/_/g, ' '),
            category: category,
            path: `${baseDir}/${path.basename(dir)}/${file}`,
            type: type
        };
    });
}

let allProjects = [];

Object.keys(categoryMap).forEach(folder => {
    const folderPath = path.join(__dirname, baseDir, folder);
    if (fs.existsSync(folderPath)) {
        allProjects = allProjects.concat(getFiles(folderPath, categoryMap[folder]));
    }
});

const content = `const localProjects = ${JSON.stringify(allProjects, null, 4)};`;
fs.writeFileSync(outputFilePath, content);
console.log(`Generated ${allProjects.length} projects in ${outputFilePath}`);

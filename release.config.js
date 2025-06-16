const config = {
    branches: ['master'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        '@semantic-release/changelog',
        ['@semantic-release/git', {
            assets: ['dist/**/*.js', 'dist/**/*.wav', 'dist/**/*.otf', 'dist/**/*.png', 'dist/**/*.txt', 'dist/*.elf', 'dist/*.ini'],
            message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
        }],
        '@semantic-release/github'
    ]
}

module.exports = config;
// This file is used to configure the release process for the project.
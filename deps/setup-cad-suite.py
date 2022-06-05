import os
import platform
import tarfile
import urllib.request

urlMap = {
    ('Darwin',
     'arm64'): 'https://github.com/YosysHQ/oss-cad-suite-build/releases/download/2022-06-05/oss-cad-suite-darwin-x64-20220605.tgz',
    ('Darwin',
     'x86_64'): 'https://github.com/YosysHQ/oss-cad-suite-build/releases/download/2022-06-05/oss-cad-suite-darwin-x64-20220605.tgz',
    ('Linux',
     'x86_64'): 'https://github.com/YosysHQ/oss-cad-suite-build/releases/download/2022-06-05/oss-cad-suite-linux-x64-20220605.tgz',
    ('Linux',
     'arm64'): 'https://github.com/YosysHQ/oss-cad-suite-build/releases/download/2022-06-05/oss-cad-suite-linux-arm64-20220605.tgz'
}


def main():
    s, m = platform.system(), platform.machine()
    if (s, m) not in urlMap:
        raise 'Mismatched system or machine'
    url = urlMap[(s, m)]
    name = 'oss-cad-suite'
    urllib.request.urlretrieve(url, name + '.tgz')
    t = tarfile.open(name + '.tgz')
    t.extractall()
    os.remove(name + '.tgz')


if __name__ == '__main__':
    main()

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
    os.remove('./oss-cad-suite/environment')
    os.rmdir('./oss-cad-suite/etc')
    os.rmdir('./oss-cad-suite/examples')
    os.rmdir('./oss-cad-suite/Frameworks')
    os.rmdir('./oss-cad-suite/py3bin')
    os.rmdir('./oss-cad-suite/share')
    os.rmdir('./oss-cad-suite/lib/python3.8')


if __name__ == '__main__':
    main()
